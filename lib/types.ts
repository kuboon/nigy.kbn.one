export type Role = "owner" | "member";

export interface Meet {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  location?: string;
  startAt: string;
  endAt: string;
  capacity: number;
  uploadsCloseAt: string;
  purgeAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  userId: string;
  role: Role;
  displayName: string;
  bio: string;
  lastReadChatAt?: string;
  createdAt: string;
}

export interface Invitation {
  token: string;
  meetId: string;
  expiresAt?: string;
  isRevoked: boolean;
  createdAt: string;
}

export interface User {
  userId: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  createdAt: string;
}
