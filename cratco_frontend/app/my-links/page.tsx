import UserInfo from "@/components/UserInfo";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import {UserLinks} from "@/components/UserLinks";

export default function LinksPage() {

    return (
        <ProtectedRoute>
            <div>
                <UserInfo/>
                <UserLinks/>
            </div>
        </ProtectedRoute>
    );
}