import { ReceiptIcon, MapPin } from "lucide-react";
import { FieldRow } from "@/components/receipts/FieldRow";
import { ReceiptItemsList } from "@/components/receipts/ReceiptItemsList";
import { TaxDetailsList } from "@/components/receipts/TaxDetailsList";
import { formatAmountSimple, formatDate } from "@/lib/utils";
import type { Receipt } from "@/types/receipt";

interface ExtractedFieldsProps {
  receipt: Receipt;
}

export function ExtractedFields({ receipt }: ExtractedFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="glass card-spotlight divide-y divide-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 bg-white/[0.02]">
          <h3 className="text-sm font-medium text-[#EDEDEF] flex items-center gap-2">
            <ReceiptIcon className="w-4 h-4 text-[#5E6AD2]" />
            Basic Information
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="px-6">
            <FieldRow
              label="Merchant"
              value={receipt.merchantName}
              confidence={receipt.merchantNameConfidence}
            />
          </div>
          {receipt.receiptType && (
            <div className="px-6">
              <FieldRow
                label="Receipt Type"
                value={receipt.receiptType}
                confidence={receipt.receiptTypeConfidence}
              />
            </div>
          )}
        </div>
        <div className="px-6">
          <FieldRow
            label="Total"
            value={formatAmountSimple(receipt.totalAmount, receipt.currency)}
            confidence={receipt.totalAmountConfidence}
          />
        </div>
        {receipt.totalTax !== null && (
          <div className="px-6">
            <FieldRow
              label="Total Tax"
              value={formatAmountSimple(
                receipt.totalTax,
                receipt.totalTaxCurrency ?? receipt.currency
              )}
              confidence={receipt.totalTaxConfidence}
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="px-6">
            <FieldRow
              label="Transaction Date"
              value={formatDate(receipt.transactionDate, "long")}
              confidence={receipt.transactionDateConfidence}
            />
          </div>
          {receipt.transactionTime && (
            <div className="px-6">
              <FieldRow
                label="Transaction Time"
                value={receipt.transactionTime.substring(0, 5)}
                confidence={receipt.transactionTimeConfidence}
              />
            </div>
          )}
        </div>
        {receipt.countryRegion && (
          <div className="px-6">
            <FieldRow
              label="Country/Region"
              value={receipt.countryRegion}
              confidence={receipt.countryRegionConfidence}
            />
          </div>
        )}
      </div>

      {/* Merchant Address */}
      {receipt.merchantAddress && (
        <div className="glass card-spotlight divide-y divide-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-white/[0.02]">
            <h3 className="text-sm font-medium text-[#EDEDEF] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5E6AD2]" />
              Merchant Address
            </h3>
          </div>
          {receipt.merchantAddress.fullAddress && (
            <div className="px-6">
              <FieldRow
                label="Full Address"
                value={receipt.merchantAddress.fullAddress}
                confidence={receipt.merchantAddress.fullAddressConfidence}
              />
            </div>
          )}
          {receipt.merchantAddress.streetAddress && (
            <div className="px-6">
              <FieldRow
                label="Street Address"
                value={receipt.merchantAddress.streetAddress}
                confidence={receipt.merchantAddress.streetAddressConfidence}
              />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {receipt.merchantAddress.road && (
              <div className="px-6">
                <FieldRow
                  label="Road"
                  value={receipt.merchantAddress.road}
                  confidence={receipt.merchantAddress.roadConfidence}
                />
              </div>
            )}
            {receipt.merchantAddress.houseNumber && (
              <div className="px-6">
                <FieldRow
                  label="House Number"
                  value={receipt.merchantAddress.houseNumber}
                  confidence={receipt.merchantAddress.houseNumberConfidence}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {receipt.merchantAddress.city && (
              <div className="px-6">
                <FieldRow
                  label="City"
                  value={receipt.merchantAddress.city}
                  confidence={receipt.merchantAddress.cityConfidence}
                />
              </div>
            )}
            {receipt.merchantAddress.postalCode && (
              <div className="px-6">
                <FieldRow
                  label="Postal Code"
                  value={receipt.merchantAddress.postalCode}
                  confidence={receipt.merchantAddress.postalCodeConfidence}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items */}
      <ReceiptItemsList items={receipt.items} currency={receipt.currency} />

      {/* Tax Details */}
      <TaxDetailsList taxDetails={receipt.taxDetails} currency={receipt.currency} />
    </div>
  );
}
