type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;

  return (
    <main>
      <h1>Project {id}</h1>
      {/* RecommendationCard list + ExportButton */}
    </main>
  );
}
