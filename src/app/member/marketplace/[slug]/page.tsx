interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Product Details: {slug}</h1>
      <p className="text-gray-500">Coming soon.</p>
    </div>
  );
}
