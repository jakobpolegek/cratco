import {UserLink} from "@/components/UserLink";

export default async function LinkPage({params}:{params:Promise<{linkId:string}>;}) {
    const {linkId} = await params;

    return (
        <UserLink linkId={linkId}/>
    );
}