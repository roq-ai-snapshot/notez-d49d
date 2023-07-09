import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { noteValidationSchema } from 'validationSchema/notes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getNotes();
    case 'POST':
      return createNote();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNotes() {
    const data = await prisma.note
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'note'));
    return res.status(200).json(data);
  }

  async function createNote() {
    await noteValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.card?.length > 0) {
      const create_card = body.card;
      body.card = {
        create: create_card,
      };
    } else {
      delete body.card;
    }
    const data = await prisma.note.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
