// import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
const stripe = require('stripe')(process.env.NEXT_STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
    try{
        const { amount } = await req.json()
        console.log('amount ------', amount)
        // Create a new payment intent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
                amount: amount, // Amount in cents
                currency: 'zmw',
                automatic_payment_methods: { enabled: true },

            })

        return NextResponse.json({clientSecret: paymentIntent.client_secret }, {status: 200})
    }
    catch(error)
    {
        console.log('err ------', error)
        return NextResponse.json({message: "Error creating payment"}, {status: 500})
    }


}