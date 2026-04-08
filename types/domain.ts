export {
  Role,
  Status,
  RegistrationStatus,
  ContentType,
  Visibility,
  PaymentStatus,
  PageStatus,
  BlockType,
  MediaType,
  AdType,
  AdPosition,
} from "@prisma/client";

import type { Role, Status } from "@prisma/client";

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
