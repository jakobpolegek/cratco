export default async function LinkPage({params}:{params:Promise<{linkId:string}>;}) {

    const {linkId} = await params;
    return (
        <div>
            {linkId}
        </div>
    );
}