import { ApplicationForm } from '@/components/applications';

export default async function FormPage() {
    return (
      <>
        <ApplicationForm />
      </>
    );
}

// 60 * 60 * 24 = 86400 -> 24 hrs
export const revalidate = 86400; // Revalidate (update) page each 24 hrs