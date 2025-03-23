import { notFound } from 'next/navigation';
import { ApplicationForm } from '@/components/applications';
// import {
//   getEmploymentTypes,
//   getApplicationStatuses,
//   getWorkModalities,
//   getAvailabilities,
// } from '@/services';

// const getInitialData = async () => {
//   try {
//     const [employmentTypes, applicationStatuses, workModalities, availabilities] = await Promise.all([
//       getEmploymentTypes(),
//       getApplicationStatuses(),
//       getWorkModalities(),
//       getAvailabilities(),
//     ]);

//     return {
//       employmentTypes: employmentTypes,
//       applicationStatuses: applicationStatuses,
//       workModalities: workModalities,
//       availabilities: availabilities,
//     };
//   } catch (error) {
//     console.error('Error fetching catalog data:', error);
//     throw error;
//   }
// };

export default async function FormPage() {
  // try {
  //   const initialData = await getInitialData();

    return (
      <>
        <ApplicationForm />
      </>
    );
  // } catch (error) {
  //   console.error(error);
  //   notFound(); // Redirects to 404 if a request fails
  // }
}

// 60 * 60 * 24 = 86400 -> 24 hrs
export const revalidate = 86400; // Revalidate (update) page each 24 hrs