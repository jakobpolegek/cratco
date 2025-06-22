import {ILink} from "@/types/ILink";

export const CustomTooltip = ({active, payload, label}: { active: boolean; payload: ILink[]; label: string }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-base-300 rounded-box shadow-md p-4">
                <span>{label}</span>
                <br/>
                {payload.map((ele, index) => (
                    <small key={index} className="text-secondary">
                        {ele.name} : {ele.visits}
                    </small>
                ))}
            </div>
        );
    }
    return null;
};