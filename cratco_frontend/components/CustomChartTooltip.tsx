import {iLink} from "@/types/iLink";

export const CustomTooltip = ({active, payload, label}: { active: boolean; payload: iLink[]; label: string }) => {
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