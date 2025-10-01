import { prisma } from '@/lib/prisma'; // Adjust the path to your Prisma client
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try{
    const { searchParams } = new URL(request.url);
  
    // Get query parameters: search and role
    const search = searchParams.get('search') || '';
    const role = searchParams.get('roles') || 'CUSTOMER'; // Default to STAFF if no role is provided
    const roles = role ? role.split(',') : ['CUSTOMER'];
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: roles as ('ADMIN' | 'STAFF' | 'CUSTOMER' | 'SUPER_ADMIN')[], // Ensure roles are valid enums
        },
        AND: {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phoneNumber: { contains: search, mode: 'insensitive' } },
          ],
        },
      },
      include: {
        accounts: true, // Include related accounts if needed
        carts: true,    // Include related carts if needed
      },
    });
  
    // return NextResponse.json(users);
    return NextResponse.json(
      { 
        users,
      },
      { status: 200 }
    );

  }catch (error) {
    console.log('Error fetching users:', error);
    return NextResponse.json(
      {
        message: 'Error fetching users',
      },
      { status: 500 }
    );
  }
}
