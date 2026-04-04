export enum Role {
  MEMBER = "MEMBER",
  MODERATOR = "MODERATOR",
  ADMIN = "ADMIN",
}

export enum Status {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  REJECTED = "REJECTED",
}

export enum RegistrationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum ContentType {
  NEWS = "NEWS",
  GALLERY = "GALLERY",
  DOCUMENT = "DOCUMENT",
  ANNOUNCEMENT = "ANNOUNCEMENT",
}

export enum Visibility {
  PUBLIC = "PUBLIC",
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
}

export type MemberProfile = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  clan?: string;
  college?: string;
  role: Role;
  membershipStatus: Status;
  profilePic?: string;
};
