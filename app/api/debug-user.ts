// pages/api/debug-user.js
import prisma from "@/lib/db";

export default async function handler(req: { method: string; body: { psuId: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { exists?: boolean; passwordLength?: number; passwordStart?: string; error?: string; }): any; new(): any; }; }; }) {
  if (req.method === 'POST') {
    try {
      const { psuId } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { psuId },
        select: {
          id: true,
          psuId: true,
          // Don't select password in production!
          password: true, // temporarily include this for debugging
        }
      });
      
      if (!user) {
        return res.status(404).json({ exists: false });
      }
      
      return res.status(200).json({ 
        exists: true, 
        passwordLength: user.password.length,
        // Return first few chars of hashed password for verification
        passwordStart: user.password.substring(0, 10) + "..." 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}