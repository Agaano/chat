import prisma from '@/prismaInstance';

export default async (req, res) => {
    if (req.method === 'POST') {
        const {name, text} = req.body;
        await prisma.message.create({
            data: {
                name: name,
                text: text,
            }
        })
        res.status(200).send();
    }
}