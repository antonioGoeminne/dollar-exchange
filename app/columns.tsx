'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Quote } from './page';

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper function to format variation
const formatVariation = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Helper function to get variation color and icon
const getVariationDisplay = (value: number) => {
  const isPositive = value >= 0;
  return {
    color: isPositive ? 'text-green-600' : 'text-red-600',
    icon: isPositive ? TrendingUp : TrendingDown,
    value: formatVariation(value),
  };
};

export const createColumns = (): ColumnDef<Quote>[] => [
  {
    accessorKey: 'name',
    header: 'Moneda',
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'buy_price',
    header: 'Compra',
    cell: ({ row }) => (
      <div className="text-gray-700">
        {formatCurrency(Number(row.getValue('buy_price')))}
      </div>
    ),
  },
  {
    accessorKey: 'sell_price',
    header: 'Venta',
    cell: ({ row }) => (
      <div className="text-gray-700">
        {formatCurrency(Number(row.getValue('sell_price')))}
      </div>
    ),
  },
  {
    accessorKey: 'variation',
    header: 'Variación',
    cell: ({ row }) => {
      const variation = Number(row.getValue('variation'));
      const { color, icon: Icon, value } = getVariationDisplay(variation);
      
      return (
        <div className={`flex items-center ${color}`}>
          <Icon className="h-4 w-4 mr-1" />
          <span>{value}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'timestamp',
    header: 'Fecha/Hora',
    cell: ({ row }) => (
      <div className="text-gray-500">
        {new Date(row.getValue('timestamp') as string).toLocaleTimeString('es-AR')}
      </div>
    ),
  },
];