import { getSession } from '@/utils/session';
import { revalidatePath } from 'next/cache';

export type client = {
  client_id?: number;
  client_type: 'individual' | 'company';
  status: string;
  notes: string;
  created_at?: string;
  updated_at?: string;
  individual?: {
    full_name: string;
    social_security_number: string;
    date_of_birth: string;
  };
  company?: {
    company_name: string;
    tax_id_number: string;
    incorporation_date: string;
  };
};

export async function getClients() {
  const session = await getSession();
  const response = await fetch('https://api.mrrodz.com/clients', {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });
  return response.json();
}

export async function addClientAction(formData: FormData) {
  'use server';

  const clientData: client = {
    client_type: formData.get('client_type') as 'individual' | 'company',
    status: formData.get('status') as string,
    notes: formData.get('notes') as string,
  };

  if (formData.get('client_type') === 'individual') {
    clientData.individual = {
      full_name: formData.get('full_name') as string,
      social_security_number: formData.get('social_security_number') as string,
      date_of_birth: formData.get('date_of_birth') as string,
    };
  } else if (formData.get('client_type') === 'company') {
    clientData.company = {
      company_name: formData.get('company_name') as string,
      tax_id_number: formData.get('tax_id_number') as string,
      incorporation_date: formData.get('incorporation_date') as string,
    };
  }

  const session = await getSession();
  await fetch('https://api.mrrodz.com/clients', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(clientData),
  });
  revalidatePath('/');
}

export async function DashboardPage() {
  const clients = await getClients();
  if (clients.message === 'Unauthorized') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4 ">Clients</h1>
      <ul className="space-y-2">
        {clients.map((client: client) => (
          <li key={client.client_id}>
            <a href="" className="text-blue-600 underline">
              {client.client_id} -{' '}
              {client.client_type === 'individual' ? (
                <>
                  {client.individual?.full_name} -{' '}
                  {client.individual?.social_security_number}
                </>
              ) : (
                <>
                  {client.company?.company_name} -{' '}
                  {client.company?.tax_id_number}
                </>
              )}
            </a>
          </li>
        ))}
      </ul>
      <form className="mt-4 space-y-2" action={addClientAction}>
        <div>
          <label className="block">Client Type</label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                name="client_type"
                value="individual"
                defaultChecked
                className="mr-2"
              />
              Individual
            </label>
            <label>
              <input
                type="radio"
                name="client_type"
                value="company"
                className="mr-2"
              />
              Company
            </label>
          </div>
        </div>
        <div>
          <label className="block">Full Name</label>
          <input
            type="text"
            name="full_name"
            defaultValue="Phillip J. Fry"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Social Security Number</label>
          <input
            type="text"
            name="social_security_number"
            defaultValue="987-65-4321"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            defaultValue="1990-01-01"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <input
            type="hidden"
            name="status"
            defaultValue="active"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block">Notes</label>
          <textarea
            name="notes"
            className="border p-2 w-full"
            defaultValue="Some random notes about the client Phillip J. Fry"></textarea>
        </div>
        <button className="bg-green-500 text-white p-4 mt-2">Enviar</button>
      </form>
    </div>
  );
}

export default DashboardPage;
