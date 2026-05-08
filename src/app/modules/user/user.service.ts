import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

type TCreateUserPayload = {
  name: string;
  email: string;
  password: string;
};

const createUser = async (payload: TCreateUserPayload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      tokenBalance: 10,
      reputationScore: 0.0,
      expertise: [],
      interests: [],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      tokenBalance: true,
      reputationScore: true,
      expertise: true,
      interests: true,
    },
  });

  return result;
};

export const UserServices = {
  createUser,
};
