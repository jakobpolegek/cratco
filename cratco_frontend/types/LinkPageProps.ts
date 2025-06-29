export type LinkPageProps = {
  params: Promise<{
    [key: string]: string;
    linkId: string;
  }>;
};
