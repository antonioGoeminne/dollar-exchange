'use client';

import React, { useState, useEffect } from 'react';
import { createColumns } from './columns';
import { useTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { DollarSign, RefreshCw } from 'lucide-react';

// Define the Quote type
type Quote = {
  id: number;
  name: string;
  buy_price: number;
  sell_price: number;
  variation: number;
  timestamp: string;
};

// Mock data generator
const generateMockData = (): Quote[] => {
  const currencies = [
    { id: 1, name: 'Dólar Oficial' },
    { id: 2, name: 'Dólar Blue' },
    { id: 3, name: 'Dólar Bolsa' },
    { id: 4, name: 'Dólar CCL' },
    { id: 5, name: 'Euro' },
    { id: 6, name: 'Real Brasileño' },
  ];

  return currencies.map(currency => {
    const baseBuy = Math.random() * 1000 + 800; // Random base price between 800-1800
    const variation = (Math.random() - 0.5) * 4; // Variation between -2% and +2%
    const sellPriceFactor = 1 + (Math.random() * 0.05 + 0.01); // Sell price 1-6% higher than buy
    
    return {
      id: currency.id,
      name: currency.name,
      buy_price: parseFloat(baseBuy.toFixed(2)),
      sell_price: parseFloat((baseBuy * sellPriceFactor).toFixed(2)),
      variation: parseFloat(variation.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
  });
};

export default function Home() {
  const [data, setData] = useState<Quote[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString('es-AR'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateMockData());
      setLastUpdated(new Date().toLocaleTimeString('es-AR'));
      setIsLoading(false);
    }, 500);
  }, []);

  // Columns configuration
  const columns = createColumns();

  // Create table instance
  const table = useTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Update data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      setTimeout(() => {
        setData(generateMockData());
        setLastUpdated(new Date().toLocaleTimeString('es-AR'));
        setIsLoading(false);
      }, 500);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans p-4">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Portal Dólar Web</h1>
          </div>
          <p className="text-gray-600">Seguimiento en tiempo real de las cotizaciones</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <h2 className="text-xl font-semibold">Cotizaciones Actualizadas</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">Última actualización:</span>
              <span className="font-mono bg-white/20 px-3 py-1 rounded-full text-sm">
                {lastUpdated}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty state */}
          {data.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles</p>
            </div>
          )}

          {/* Loading state */}
          {isLoading && data.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-500">Cargando cotizaciones...</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>Datos actualizados cada 10 segundos • Fuente: Simulación</p>
        </motion.div>
      </div>
    </div>
  );
}
