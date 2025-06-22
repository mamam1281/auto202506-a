'use client';

import React, { forwardRef } from 'react';
import { cn } from './utils';
import styles from './Table.module.css';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  className?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className={styles.tableWrapper}>
      <table
        ref={ref}
        className={cn(styles.table, className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = 'Table';

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(styles.tableHeader, className)}
      {...props}
    />
  )
);
TableHeader.displayName = 'TableHeader';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(styles.tableBody, className)}
      {...props}
    />
  )
);
TableBody.displayName = 'TableBody';

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string;
}

export const TableFooter = forwardRef<HTMLTableSectionElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(styles.tableFooter, className)}
      {...props}
    />
  )
);
TableFooter.displayName = 'TableFooter';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(styles.tableRow, className)}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(styles.tableHead, className)}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  className?: string;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(styles.tableCell, className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  className?: string;
}

export const TableCaption = forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn(styles.tableCaption, className)}
      {...props}
    />
  )
);
TableCaption.displayName = 'TableCaption';
