interface Props {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Order Details: {id}</h1>
      <p className="text-gray-500">Coming soon.</p>
    </div>
  );
}
