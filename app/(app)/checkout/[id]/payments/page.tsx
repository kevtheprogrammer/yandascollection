import PaymentComp from "./components/PaymentComp";

interface PageProps {
  params: Promise<{ id: string }> 
}

export default async function Page({ params }: PageProps) {
  const { id } = await params; // convert string → number
  const num_id = Number(id)
  return <PaymentComp id={num_id} />;
}
