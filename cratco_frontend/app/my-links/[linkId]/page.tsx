import { getLink } from '@/lib/links/actions';
import { UserLink } from '@/components/UserLink';
import Link from 'next/link';
import { LinkPageProps } from '@/types/LinkPageProps';

export default async function LinkPage({ params }: LinkPageProps) {
  const resolvedParams = await params;
  const linkId = resolvedParams.linkId;
  const link = await getLink(linkId, true);

  if (!link) {
    return (
      <div className="text-center text-xl mt-10 text-gray-100">
        <h1 className="text-2xl font-bold">Link not Found!</h1>
        <p>
          The link you are looking for does not exist or you do not have
          permission to view it.
        </p>
        <Link href="/my-links" className="btn btn-secondary mt-4">
          Go back!
        </Link>
      </div>
    );
  }

  return <UserLink link={link} />;
}
