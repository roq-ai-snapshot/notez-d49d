import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { noteValidationSchema } from 'validationSchema/notes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.note
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getNoteById();
    case 'PUT':
      return updateNoteById();
    case 'DELETE':
      return deleteNoteById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getNoteById() {
    const data = await prisma.note.findFirst(convertQueryToPrismaUtil(req.query, 'note'));
    return res.status(200).json(data);
  }

  async function updateNoteById() {
    await noteValidationSchema.validate(req.body);
    const data = await prisma.note.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteNoteById() {
    const data = await prisma.note.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
