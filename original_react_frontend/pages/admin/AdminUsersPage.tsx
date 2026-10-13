import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';
import { User } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-2xl font-bold text-neutral-900">Registered Platform Users</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Review customer accounts, administrator roles, and registered shopper directories.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-neutral-50 text-neutral-600 font-mono uppercase text-[11px] border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Phone</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-right">Orders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {u.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="font-semibold text-neutral-900">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-neutral-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {u.role === 'ROLE_ADMIN' && <ShieldCheck className="w-3 h-3 text-amber-700" />}
                      <span>{u.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-neutral-500 font-mono">
                    {u.phoneNumber || '—'}
                  </td>
                  <td className="py-3 px-4 text-neutral-500 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 tabular-nums">
                    {u.totalOrders ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
