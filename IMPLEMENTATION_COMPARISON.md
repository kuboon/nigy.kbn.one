# AGENTS.md vs実装比較

作成日時: 2025年10月31日

## 実装状況サマリー

| カテゴリ | ステータス | 進捗 |
|---------|----------|------|
| **Meet管理** | 部分的 | 25% |
| **招待管理** | 完成 | 100% |
| **Chat機能** | 未実装 | 0% |
| **Photo機能** | 未実装 | 0% |
| **Export機能** | 未実装 | 0% |
| **リアルタイム(WS)** | 未実装 | 0% |
| **セキュリティ** | 部分的 | 30% |
| **型定義** | 部分的 | 40% |

---

## 実装済み機能 ✅

### 招待管理 (100%)
- ✅ `POST /meets/:id/invitations` - 招待URL生成
- ✅ `DELETE /meets/:id/invitations/:token` - 招待取り消し
- ✅ `GET /invites/:token` - 招待詳細確認
- ✅ `POST /invites/:token/accept` - ミート参加

### Meet一覧取得 (部分的)
- ✅ `GET /me/meets` - 参加ミート一覧
- ⚠️ 不足: `unreadChatCount`, `lastMessageAt`, `lastPhotoAt`

### Meet作成 (完成)
- ✅ `POST /meets` - ミート作成（オーナー自動登録）
- ✅ `capacity` 検証 (1-50)
- ✅ `uploadsCloseAt` (+14d) と `purgeAt` (+28d) の計算

### UI表示 (部分的)
- ✅ `GET /meets/:id` - ページレンダリング（TSXファイル）
  - 表示のみ、APIエンドポイントなし

---

## 未実装機能 ❌

### Meet管理エンドポイント
| API | メソッド | 要件 | 優先度 |
|-----|---------|------|-------|
| `/meets/:id` | GET | JSON APIレスポンス（ページではなく） | 高 |
| `/meets/:id` | PATCH | オーナーのみ。title/description/location/startAt/endAt/capacity更新 | 高 |
| `/meets/:id` | DELETE | オーナーのみ。カスケード削除（membership/invitation/chat/photo） | 高 |
| `/me/meets/:id` | DELETE | ミート離脱（membership削除、ユーザーメートインデックス更新） | 高 |
| `/meets/:id/members/:userId` | DELETE | オーナーのみ。メンバーをキック | 中 |
| `/meets/:id/members/me` | PATCH | 参加者プロフィール更新（displayName/bio） | 中 |

### Chat機能
| API | メソッド | 仕様 |
|-----|---------|------|
| `/meets/:id/chats` | GET | `?before=ts&limit=50` パラメータ。chatIdの降順 |
| `/meets/:id/chats` | POST | body (1-2000文字, plain text のみ) |
| `/meets/:id/chats/read` | POST | `lastReadChatAt` 更新 |

**型定義が必要:**
```typescript
interface Chat {
  id: string;        // ULID
  meetId: string;
  userId: string;
  body: string;      // 1-2000 chars
  createdAt: string; // ISO
}
```

**制約:**
- アップロード終了後（now >= uploadsCloseAt）は403で拒否
- plain textのみ（XSS防止）

### Photo機能
| API | メソッド | 説明 |
|-----|---------|------|
| `/meets/:id/photos/upload-urls` | POST | 署名付きURL生成（original + thumbnail） |
| `/meets/:id/photos/commit` | POST | Photo記録作成 |
| `/meets/:id/photos` | GET | `?cursor&limit=50` ページネーション |

**型定義が必要:**
```typescript
interface Photo {
  id: string;        // ULID
  meetId: string;
  userId: string;
  originalObjectKey: string;
  thumbnailObjectKey: string;
  bytes: number;
  mime: string;      // image/jpeg|png|webp|heic
  width?: number;
  height?: number;
  createdAt: string;
}
```

**仕様:**
- Cloudflare R2統合
- S3 SigV4署名URL（短TTL）
- クライアントでthumb生成、2つのファイル（original + thumbnail）をアップロード
- 制約: ≤25MB, mime ∈ {image/jpeg, image/png, image/webp, image/heic?}

### Export機能
| API | メソッド | 説明 |
|-----|---------|------|
| `/meets/:id/exports` | POST | エクスポート開始 |
| `/meets/:id/exports/:exportId` | GET | エクスポートステータス/ダウンロードURL |

**型定義が必要:**
```typescript
interface Export {
  id: string;        // ULID
  meetId: string;
  userId: string;
  kind: 'photos' | 'chat' | 'all';
  status: 'queued' | 'running' | 'done' | 'failed';
  objectKey?: string;
  error?: string;
  createdAt: string;
  finishedAt?: string;
}
```

**仕様:**
- +14d～+28d期間のみエクスポート可能
- クライアント側: MAX_EXPORT_BYTES (例: 500MB) チェック
- サーバー側: ZIP64対応ライブラリ

### リアルタイム (WebSocket)
- JWT認証でコネクト
- ミート単位でルーム参加
- イベント: `chat:new`, `photo:new`, `meet:updated`, `member:joined|left`, `unread:count`

---

## 仕様と実装の差分

### 1. Meet型の`duration`フィールド
**AGENTS.md:**
```
startAt, duration, capacity
```

**types.ts:**
```typescript
startAt: string;
endAt: string;
capacity: number;
```

**問題:** durationが存在しない。endAtを使用している。
**解決:** 確認が必要。durationを追加するか、endAtのみで十分か検討。

### 2. Membership型の`lastReadChatAt`
**AGENTS.md:**
```
lastChatReadAt?
```

**types.ts:**
```typescript
lastReadChatAt?: string;
```

**状態:** ✅ 合致

### 3. Capacity制約
**AGENTS.md:**
```
New join requests are **rejected (409)** when member count ≥ capacity.
```

**実装:** `/invites/[token]/accept.ts`
```typescript
// capacity チェックなし！
```

**問題:** Capacity制約が実装されていない

### 4. `/me/meets`の応答
**AGENTS.md:**
```
GET /me/meets → list joined meets with `unreadChatCount`, `lastMessageAt`,
`lastPhotoAt` (best-effort summaries).
```

**実装:** meet + participants 返却のみ

**問題:** unreadChatCount, lastMessageAt, lastPhotoAt がない

---

## セキュリティ実装状況

| 項目 | 要件 | 状態 |
|-----|------|------|
| Auth | JWT (cookie HttpOnly/Secure/Lax or Bearer) | ⚠️ 部分 |
| CSRF | Cookie時のみ必要 | ❌ 未実装 |
| Signed URLs | path & content-type/length スコープ, TTL制限 | ❌ 未実装 |
| CORS | Photo/thumbs許可 | ❌ 未実装 |
| Rate Limit | chat (10/10s), upload-url (5/min), auth throttle | ❌ 未実装 |
| XSS Protection | Chat plain text, client-side linkify | ⚠️ 要確認 |

---

## 優先度別タスク一覧

### P0 (コア機能)
1. `GET /meets/:id` API endpoint (型定義から)
2. `POST /meets/:id/chats` 実装
3. `GET /meets/:id/chats` 実装
4. `POST /meets/:id/photos/upload-urls` 実装
5. `POST /meets/:id/photos/commit` 実装

### P1 (重要)
6. `PATCH /meets/:id` 実装 (owner check)
7. `DELETE /meets/:id` 実装 (カスケード削除)
8. `DELETE /me/meets/:id` 実装 (leave)
9. Capacity 409制約実装
10. Unread chat count 実装

### P2 (ユーザー体験)
11. `DELETE /meets/:id/members/:userId` (kick)
12. `PATCH /meets/:id/members/me` (profile update)
13. WebSocket realtime

### P3 (インフラ)
14. Export機能
15. Rate limiting
16. CSRF保護
17. CORS設定

---

## 次のステップ

1. **型定義を完成させる** (Chat, Photo, Export)
2. **Chat基本機能を実装** (コア機能)
3. **Photo storage統合** (Cloudflare R2)
4. **セキュリティ強化** (Rate limit, CSRF, CORS)
5. **WebSocket realtime** (複雑度高)
6. **Export機能** (複雑度高)
