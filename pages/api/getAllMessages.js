import prisma from '@/prismaInstance';

export default async (req, res) => {
    const data = await prisma.message.findMany({});
    res.status(200).json({data});
}