# Repository Instructions

Please refer to the files in `.github/instructions/` for detailed guidance when
working in this repository.

---

meet hub — Minimal Implementation Spec (Deno KV)

Goal: ephemeral meet-based chat & photo sharing with export window.

1. Lifecycle • Posting close: uploadsCloseAt = meetAt + 14d → chat/photo write
   disabled. • Purge: purgeAt = meetAt + 28d → delete meet, chats, photos,
   invites, memberships, and objects. • Date change: recompute close/purge. Once
   closed, do not reopen posting.

2. Roles

Action Owner Member Edit meet (time/place/desc) ✅ ❌ Invite URL issue/revoke ✅
❌ Kick member / leave ✅ / — ❌ / ✅ Post chat / upload photo (≤+14d) ✅ ✅
Export (+14d…+28d) ✅ ✅

3. Data model — Deno KV keys • User: ['user', userId] → {email, displayName,
   passwordHash, createdAt} • User Email Index: ['email', email] → userId • User
   Meets Index: ['user', userId, 'meets'] → meetId[] • Meet: ['meet', meetId] →
   {ownerId, title, description?, location?, startAt, endAt, capacity,
   uploadsCloseAt, purgeAt, createdAt, updatedAt} • Membership: ['meet', meetId,
   'member', userId] → {role, displayName, bio, lastReadChatAt?, createdAt} •
   Invitation: ['meet', meetId, 'invite', token] → {expiresAt?, isRevoked,
   createdAt} • Chat: ['meet', meetId, 'chat', chatId] → {userId, body,
   createdAt} // chatId = ulid() • Photo: ['meet', meetId, 'photo', photoId] →
   {userId, objectKey, bytes, mime, width?, height?, createdAt} • Export:
   ['meet', meetId, 'export', exportId] → {userId, kind('photos'|'chat'|'all'),
   status('queued'|'running'|'done'|'failed'), objectKey?, error?, createdAt,
   finishedAt?}

Notes • Prefix scans per meet: kv.list({ prefix: ['meet', meetId] }) for
cleanup. • Listing my meets: read ['user', me, 'meets'] → meetId[], then fetch
['meet', meetId].

3.a Amendments (from §11) • Meet now includes capacity (1–50): ['meet', meetId]
→ {..., capacity, ...}. • Membership now includes per-meet profile fields:
displayName, bio (≤500 chars): ['meet', meetId, 'member', userId] → {role,
displayName, bio, lastReadChatAt?, createdAt}.

4. APIs (HTTP)

Meets • POST /meets → create (Owner auto-membership). Body includes capacity
(1..50). Server computes close/purge. • GET /me/meets → list joined meets with
unreadChatCount, lastMessageAt, lastPhotoAt (best-effort summaries). • GET
/meets/:id → details. Includes participants: {userId, role, displayName, bio}
for overview list. • PATCH /meets/:id (owner) → edit
(title/description/location/startAt/endAt/capacity). • DELETE /meets/:id (owner)
→ immediate delete.

Invites • POST /meets/:id/invitations → {url}; multiple allowed. • DELETE
/meets/:id/invitations/:token → revoke. • GET /invites/:token → summary (login
gate handled upstream). • POST /invites/:token/accept → upsert membership +
['user_meets', userId, meetId]. Reject with 409 if membersCount ≥ capacity.

Members • PATCH /meets/:id/members/me {displayName?, bio?} → edit own profile in
this meet (bio ≤ 500 chars). • DELETE /meets/:id/members/:userId (owner) → kick.
• DELETE /me/meets/:id → leave.

Chat • GET /meets/:id/chats?before=ts&limit=50 (desc by chatId). • POST
/meets/:id/chats {body} (403 if now ≥ uploadsCloseAt). • POST
/meets/:id/chats/read {lastReadAt?} → update lastReadChatAt.

Photos • Client creates thumbnail locally, then uploads two files (original +
thumbnail). • POST /meets/:id/photos/upload-urls { original:{mime,bytes},
thumb:{mime,bytes} } → { original:{putUrl, objectKey, expiresAt}, thumb:{putUrl,
objectKey, expiresAt} }. • Client uploads both via PUT, then: • POST
/meets/:id/photos/commit { original:{objectKey, mime, bytes, width?, height?},
thumb:{objectKey, mime, bytes, width?, height?} } → create Photo (server stores
both URLs in record; response returns thumbnailUrl & originalUrl). • GET
/meets/:id/photos?cursor&limit=50 → items: {photoId, thumbnailUrl, originalUrl,
bytes, width?, height?, createdAt, userId}. • Client export (no server):
selection UI sums bytes; disallow when total exceeds MAX_EXPORT_BYTES.

5. Realtime (WS) (WS) • Connect with JWT; join per-meet rooms. • Events:
   chat:new, photo:new, meet:updated, member:joined|left,
   unread:count{meetId,count}.

6. Storage (objects) • Backend: Cloudflare R2 (S3-compatible). Bucket e.g.
   meethub-photos; served via Cloudflare. • Object keys: • Original:
   meets/{meetId}/photos/{photoId}.{ext} • Thumbnail:
   meets/{meetId}/photos/{photoId}.thumb.{ext} (e.g., .jpg) • Access: AWS SigV4
   signed URLs for PUT/GET (short TTL). Bucket CORS must allow GET, PUT, HEAD
   from app origin. • Generation: Thumbnails are client-generated
   (Canvas/WebCodecs) and uploaded separately; no server-side transforms
   assumed.

7. Jobs • Close/Export gate: scan meets hourly; enforce posting ban at
   uploadsCloseAt. • Export build: stream photos + NDJSON chats → ZIP → mark
   done with objectKey. • Purge: delete KV prefix ['meet', meetId, ...], related
   ['user_meets', *], and storage objects.

8. Unread count • Basis: membership.lastReadChatAt. • Count = chats with
   createdAt > lastReadChatAt (or chatId > boundary). Cache/approx allowed for
   list.

9. Constraints & Guards • Chat: 1..2000 chars; plain text only. • Photo: bytes ≤
   25MB, mime ∈ {image/jpeg,png,webp,heic?}. • Invite: !isRevoked && (!expiresAt
   || expiresAt > now). • Posting disabled when now ≥ uploadsCloseAt. • Client
   export limit: MAX_EXPORT_BYTES (e.g., 500MB). Selection UI must prevent
   exceeding this. • Capacity: capacity ∈ [1, 50]. Lowering below current
   members does not auto-remove members; new joins are blocked when full. •
   Per-meet profile: displayName and bio editable anytime; bio.length ≤ 500
   (plain text).

10. Security • Auth: JWT (short-lived) via cookie (HttpOnly, Secure, Lax) or
    Authorization: Bearer. • CSRF: required only for cookie mode (token or
    double-submit); none for Bearer. • Signed URLs: scope path &
    content-type/length; short TTL. • Rate limits (per IP+user): chats (10/10s),
    upload-url (5/min), auth throttling. • XSS: render chat as plain text;
    linkify client-side safely.

⸻

Implementation notes: Use ULIDs for chatId/photoId for monotonic ordering; rely
on KV atomic ops for membership/invite acceptance; all meet data lives under
['meet', meetId, ...] for simple purge.

11. Participant Profiles and Capacity • Each participant defines per-meet
    profile: {displayName, bio}. • bio: free text ≤ 500 chars (self-intro /
    recent status). Editable anytime. • PATCH /meets/:id/members/me allows
    update. • GET /meets/:id returns participants: {userId, role, displayName,
    bio} for overview display.

Capacity • capacity: number of allowed participants (1–50). Owner can set or
modify anytime via POST/PATCH /meets/:id. • New join requests are rejected (409)
when member count ≥ capacity. • Lowering capacity below current count does not
auto-remove members.
