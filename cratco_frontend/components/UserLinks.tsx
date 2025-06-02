'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import {iLink} from "@/types/iLink";


export function UserLinks() {
    const {apiCall} = useApi();
    const [links, setLinks] = useState<iLink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const data = await apiCall('/links');
                setLinks(data);
            } catch (error) {
                console.error('Failed to fetch links:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    return (
        <div className="flex justify-center mt-8">
            {loading? (
                <span className="loading loading-infinity loading-xl"></span>
            ) : (
                <div>
                    {links?.length=== 0  ?  <div>No links yet.</div> :
                    <ul className="list text-center ">
                        <li className=" text-xl opacity-60 tracking-wide">My links: </li>
                        {links?.map((link) => (
                        <li className="list-row bg-base-100 rounded-box shadow-md mt-2 px-4 py-2" key={link._id}>
                            <Link href={`/my-links/${link._id}`}>
                                <div className="list-col-grow">
                                    <div className="text-2xl uppercase font-semibold">{link.name}</div>
                                    <div className="text-xl opacity-60">{link.customAddress}</div>
                                </div>
                            </Link>
                        </li>
                        ))}
                    </ul>}
                </div>
            )}
        </div>
    );
}