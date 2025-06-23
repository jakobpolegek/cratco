export const CustomTooltip = ({active, payload, label}: { active: boolean; payload: { name:string, value:string }[]; label: string }) => {
    if (active && payload?.length) {
        return (
            <div className="bg-base-300 rounded-box shadow-md p-4">
                <span>{label}</span>
                <br/>
                {payload.map((ele, index) => (
                    <small key={index} className="text-secondary">
                        {ele.name} : {ele.value}
                    </small>
                ))}
            </div>
        );
    }
    return null;
};