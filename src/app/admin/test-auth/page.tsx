import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TestAuthPage() {
  const session = await getServerSession(authOptions);

  // If not logged in as admin, this should be handled by middleware, 
  // but good to have a fallback check.
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Authentication Test Page</h1>
      <p className="mt-4 text-green-600 font-bold">
        ✅ Successfully authenticated as Admin!
      </p>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {JSON.stringify(session, null, 2)}
      </pre>
      <a href="/api/auth/signout" className="mt-4 inline-block px-4 py-2 bg-red-500 text-white rounded">
        Sign Out
      </a>
    </div>
  );
}
