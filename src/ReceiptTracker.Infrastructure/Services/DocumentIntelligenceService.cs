using Azure;
using Azure.AI.DocumentIntelligence;
using Microsoft.Extensions.Logging;
using ReceiptTracker.Core.Interfaces;
using ReceiptTracker.Core.Models;

namespace ReceiptTracker.Infrastructure.Services;

public class DocumentIntelligenceService : IDocumentIntelligenceService
{
    private readonly DocumentIntelligenceClient _client;
    private readonly ILogger<DocumentIntelligenceService> _logger;

    public const double ConfidenceThreshold = 0.80;

    public DocumentIntelligenceService(
        DocumentIntelligenceClient client,
        ILogger<DocumentIntelligenceService> logger)
    {
        _client = client;
        _logger = logger;
    }

    public async Task<ReceiptExtractionResult> ExtractReceiptDataAsync(Stream receiptStream)
    {
        try
        {
            _logger.LogInformation("Calling Document Intelligence...");

            BinaryData bytesSource = BinaryData.FromStream(receiptStream);

            var operation = await _client.AnalyzeDocumentAsync(
                WaitUntil.Completed,
                "prebuilt-receipt",
                bytesSource);

            var analyzeResult = operation.Value;

            if (analyzeResult.Documents == null || analyzeResult.Documents.Count == 0)
            {
                _logger.LogWarning("Document Intelligence found no receipt in the image.");
                return new ReceiptExtractionResult
                {
                    Success = false,
                    ErrorMessage = "Document Intelligence could not identify a receipt in the uploaded image."
                };
            }

            var document = analyzeResult.Documents[0];
            var result = new ReceiptExtractionResult { Success = true };
            bool needsReview = false;

            ExtractBasicFields(document, result, ref needsReview);
            ExtractExtendedFields(document, result, ref needsReview);
            ExtractItems(document, result, ref needsReview);
            ExtractMerchantAddress(document, result, ref needsReview);
            ExtractTaxDetails(document, result, ref needsReview);
            ExtractTax(document, result, ref needsReview);

            result.NeedsReview = needsReview;

            _logger.LogInformation(
                "Extraction complete. Merchant: '{Merchant}', Total: {Total} {Currency}, Items: {ItemCount}, NeedsReview: {NeedsReview}",
                result.MerchantName, result.TotalAmount, result.Currency, result.Items.Count, result.NeedsReview);

            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Document Intelligence call failed.");
            return new ReceiptExtractionResult
            {
                Success = false,
                ErrorMessage = $"Document Intelligence error: {ex.Message}"
            };
        }
    }

    private void ExtractBasicFields(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        // MerchantName
        if (document.Fields.TryGetValue("MerchantName", out var merchantField)
            && merchantField.FieldType == DocumentFieldType.String)
        {
            result.MerchantName = merchantField.ValueString;
            result.MerchantNameConfidence = merchantField.Confidence ?? 0;

            if (result.MerchantNameConfidence < ConfidenceThreshold)
            {
                needsReview = true;
                _logger.LogInformation(
                    "MerchantName confidence {Confidence:F2} is below threshold {Threshold}",
                    result.MerchantNameConfidence, ConfidenceThreshold);
            }
        }
        else
        {
            needsReview = true;
            _logger.LogInformation("MerchantName field not found in Document Intelligence response.");
        }

        // Total
        if (document.Fields.TryGetValue("Total", out var totalField)
            && totalField.FieldType == DocumentFieldType.Currency)
        {
            result.TotalAmount = (decimal)totalField.ValueCurrency.Amount;
            result.Currency = totalField.ValueCurrency.CurrencyCode
                           ?? totalField.ValueCurrency.CurrencySymbol;
            result.TotalAmountConfidence = totalField.Confidence ?? 0;

            if (result.TotalAmountConfidence < ConfidenceThreshold)
            {
                needsReview = true;
                _logger.LogInformation(
                    "Total confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TotalAmountConfidence, ConfidenceThreshold);
            }
        }
        else
        {
            needsReview = true;
            _logger.LogInformation("Total field not found in Document Intelligence response.");
        }

        // TransactionDate
        if (document.Fields.TryGetValue("TransactionDate", out var dateField)
            && dateField.FieldType == DocumentFieldType.Date)
        {
            result.TransactionDate = dateField.ValueDate?.Date;
            result.TransactionDateConfidence = dateField.Confidence ?? 0;

            if (result.TransactionDateConfidence < ConfidenceThreshold)
            {
                needsReview = true;
                _logger.LogInformation(
                    "TransactionDate confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TransactionDateConfidence, ConfidenceThreshold);
            }
        }
        else
        {
            needsReview = true;
            _logger.LogInformation("TransactionDate field not found in Document Intelligence response.");
        }
    }

    private void ExtractExtendedFields(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        // TransactionTime
        if (document.Fields.TryGetValue("TransactionTime", out var timeField)
            && timeField.FieldType == DocumentFieldType.Time)
        {
            result.TransactionTime = timeField.ValueTime;
            result.TransactionTimeConfidence = timeField.Confidence ?? 0;

            if (result.TransactionTimeConfidence < ConfidenceThreshold)
            {
                needsReview = true;
                _logger.LogInformation(
                    "TransactionTime confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TransactionTimeConfidence, ConfidenceThreshold);
            }
        }

        // CountryRegion
        if (document.Fields.TryGetValue("CountryRegion", out var countryField)
            && countryField.FieldType == DocumentFieldType.CountryRegion)
        {
            result.CountryRegion = countryField.ValueCountryRegion;
            result.CountryRegionConfidence = countryField.Confidence ?? 0;

            if (result.CountryRegionConfidence < ConfidenceThreshold)
            {
                _logger.LogInformation(
                    "CountryRegion confidence {Confidence:F2} is below threshold {Threshold}",
                    result.CountryRegionConfidence, ConfidenceThreshold);
            }
        }

        // ReceiptType
        if (document.Fields.TryGetValue("ReceiptType", out var typeField)
            && typeField.FieldType == DocumentFieldType.String)
        {
            result.ReceiptType = typeField.ValueString;
            result.ReceiptTypeConfidence = typeField.Confidence ?? 0;

            if (result.ReceiptTypeConfidence < ConfidenceThreshold)
            {
                _logger.LogInformation(
                    "ReceiptType confidence {Confidence:F2} is below threshold {Threshold}",
                    result.ReceiptTypeConfidence, ConfidenceThreshold);
            }
        }

        // TotalTax
        if (document.Fields.TryGetValue("TotalTax", out var totalTaxField)
            && totalTaxField.FieldType == DocumentFieldType.Currency)
        {
            result.TotalTax = (decimal)totalTaxField.ValueCurrency.Amount;
            result.TotalTaxCurrency = totalTaxField.ValueCurrency.CurrencyCode
                                     ?? totalTaxField.ValueCurrency.CurrencySymbol;
            result.TotalTaxConfidence = totalTaxField.Confidence ?? 0;

            if (result.TotalTaxConfidence < ConfidenceThreshold)
            {
                _logger.LogInformation(
                    "TotalTax confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TotalTaxConfidence, ConfidenceThreshold);
            }
        }
    }

    private void ExtractItems(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        if (!document.Fields.TryGetValue("Items", out var itemsField)
            || itemsField.FieldType != DocumentFieldType.List)
        {
            _logger.LogInformation("Items field not found or not a list. FieldType: {FieldType}",
                itemsField?.FieldType.ToString() ?? "null");
            return;
        }

        _logger.LogInformation("Found {ItemCount} items in receipt", itemsField.ValueList.Count);

        foreach (var itemField in itemsField.ValueList)
        {
            if (itemField.FieldType != DocumentFieldType.Dictionary)
            {
                _logger.LogInformation("Skipping item - not a dictionary. FieldType: {FieldType}", itemField.FieldType);
                continue;
            }

            var itemDict = itemField.ValueDictionary;
            var item = new ReceiptItem();

            // Description
            if (itemDict.TryGetValue("Description", out var descField)
                && descField.FieldType == DocumentFieldType.String)
            {
                item.Description = descField.ValueString;
                item.DescriptionConfidence = descField.Confidence ?? 0;
            }

            // Quantity
            if (itemDict.TryGetValue("Quantity", out var qtyField)
                && qtyField.FieldType == DocumentFieldType.Double)
            {
                item.Quantity = qtyField.ValueDouble;
                item.QuantityConfidence = qtyField.Confidence ?? 0;
            }
            else if (itemDict.TryGetValue("Quantity", out var qtyIntField)
                && qtyIntField.FieldType == DocumentFieldType.Int64)
            {
                item.Quantity = qtyIntField.ValueInt64;
                item.QuantityConfidence = qtyIntField.Confidence ?? 0;
            }

            // TotalPrice (line total)
            if (itemDict.TryGetValue("TotalPrice", out var totalPriceField)
                && totalPriceField.FieldType == DocumentFieldType.Currency)
            {
                item.TotalPrice = (decimal)totalPriceField.ValueCurrency.Amount;
                item.TotalPriceCurrency = totalPriceField.ValueCurrency.CurrencyCode
                                        ?? totalPriceField.ValueCurrency.CurrencySymbol;
                item.TotalPriceConfidence = totalPriceField.Confidence ?? 0;
            }

            // Price (unit price)
            if (itemDict.TryGetValue("Price", out var priceField)
                && priceField.FieldType == DocumentFieldType.Currency)
            {
                item.Price = (decimal)priceField.ValueCurrency.Amount;
                item.PriceCurrency = priceField.ValueCurrency.CurrencyCode
                                    ?? priceField.ValueCurrency.CurrencySymbol;
                item.PriceConfidence = priceField.Confidence ?? 0;
            }

            result.Items.Add(item);

            if (item.DescriptionConfidence < ConfidenceThreshold
                || (item.TotalPriceConfidence > 0 && item.TotalPriceConfidence < ConfidenceThreshold))
            {
                needsReview = true;
            }
        }

        _logger.LogInformation("Extracted {ExtractedCount} items", result.Items.Count);
    }

    private void ExtractMerchantAddress(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        if (!document.Fields.TryGetValue("MerchantAddress", out var addressField))
        {
            _logger.LogInformation("MerchantAddress field not found in Document Intelligence response.");
            return;
        }

        _logger.LogInformation("Found MerchantAddress field with FieldType: {FieldType}", addressField.FieldType);

        var address = new MerchantAddress();

        if (addressField.FieldType == DocumentFieldType.Address && addressField.ValueAddress != null)
        {
            var addr = addressField.ValueAddress;
            
            if (!string.IsNullOrEmpty(addr.HouseNumber))
            {
                address.HouseNumber = addr.HouseNumber;
                address.HouseNumberConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.Road))
            {
                address.Road = addr.Road;
                address.RoadConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.PostalCode))
            {
                address.PostalCode = addr.PostalCode;
                address.PostalCodeConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.City))
            {
                address.City = addr.City;
                address.CityConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.State))
            {
                address.State = addr.State;
                address.StateConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.CountryRegion))
            {
                address.CountryRegion = addr.CountryRegion;
                address.CountryRegionConfidence = addressField.Confidence ?? 0;
            }
            if (!string.IsNullOrEmpty(addr.StreetAddress))
            {
                address.StreetAddress = addr.StreetAddress;
                address.StreetAddressConfidence = addressField.Confidence ?? 0;
            }

            var addressParts = new List<string>();
            if (!string.IsNullOrEmpty(addr.StreetAddress))
                addressParts.Add(addr.StreetAddress);
            else if (!string.IsNullOrEmpty(addr.HouseNumber) || !string.IsNullOrEmpty(addr.Road))
                addressParts.Add($"{addr.Road} {addr.HouseNumber}".Trim());
            
            if (!string.IsNullOrEmpty(addr.City))
                addressParts.Add(addr.City);
            
            if (!string.IsNullOrEmpty(addr.State))
                addressParts.Add(addr.State);
            
            if (!string.IsNullOrEmpty(addr.PostalCode))
                addressParts.Add(addr.PostalCode);
            
            if (!string.IsNullOrEmpty(addr.CountryRegion))
                addressParts.Add(addr.CountryRegion);

            address.FullAddress = string.Join(", ", addressParts);
            address.FullAddressConfidence = addressField.Confidence ?? 0;

            _logger.LogInformation("Extracted merchant address: {FullAddress}", address.FullAddress);
        }
        // Fallback
        else if (addressField.FieldType == DocumentFieldType.Dictionary)
        {
            var addressDict = addressField.ValueDictionary;
            _logger.LogDebug("Address dictionary fields: {Fields}", string.Join(", ", addressDict.Keys));

            if (addressDict.TryGetValue("Address", out var fullAddrField)
                && fullAddrField.FieldType == DocumentFieldType.Address)
            {
                address.FullAddress = fullAddrField.ValueAddress.ToString();
                address.FullAddressConfidence = fullAddrField.Confidence ?? 0;
            }

            if (addressDict.TryGetValue("HouseNumber", out var houseField)
                && houseField.FieldType == DocumentFieldType.String)
            {
                address.HouseNumber = houseField.ValueString;
                address.HouseNumberConfidence = houseField.Confidence ?? 0;
            }

            if (addressDict.TryGetValue("Road", out var roadField)
                && roadField.FieldType == DocumentFieldType.String)
            {
                address.Road = roadField.ValueString;
                address.RoadConfidence = roadField.Confidence ?? 0;
            }

            if (addressDict.TryGetValue("PostalCode", out var postalField)
                && postalField.FieldType == DocumentFieldType.String)
            {
                address.PostalCode = postalField.ValueString;
                address.PostalCodeConfidence = postalField.Confidence ?? 0;
            }

            if (addressDict.TryGetValue("City", out var cityField)
                && cityField.FieldType == DocumentFieldType.String)
            {
                address.City = cityField.ValueString;
                address.CityConfidence = cityField.Confidence ?? 0;
            }

            if (addressDict.TryGetValue("StreetAddress", out var streetField)
                && streetField.FieldType == DocumentFieldType.String)
            {
                address.StreetAddress = streetField.ValueString;
                address.StreetAddressConfidence = streetField.Confidence ?? 0;
            }
        }
        else
        {
            _logger.LogWarning("MerchantAddress field has unexpected type: {FieldType}", addressField.FieldType);
            return;
        }

        result.MerchantAddress = address;
    }

    private void ExtractTaxDetails(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        if (!document.Fields.TryGetValue("TaxDetails", out var taxDetailsField)
            || taxDetailsField.FieldType != DocumentFieldType.List)
        {
            _logger.LogInformation("TaxDetails field not found or not a list. FieldType: {FieldType}",
                taxDetailsField?.FieldType.ToString() ?? "null");
            return;
        }

        _logger.LogInformation("Found {TaxDetailCount} tax details in receipt", taxDetailsField.ValueList.Count);

        foreach (var taxDetailField in taxDetailsField.ValueList)
        {
            if (taxDetailField.FieldType != DocumentFieldType.Dictionary)
            {
                _logger.LogInformation("Skipping tax detail - not a dictionary. FieldType: {FieldType}", taxDetailField.FieldType);
                continue;
            }

            var taxDict = taxDetailField.ValueDictionary;
            var taxDetail = new TaxDetail();

            _logger.LogDebug("Tax detail fields: {Fields}", string.Join(", ", taxDict.Keys));

            // Amount
            if (taxDict.TryGetValue("Amount", out var amountField)
                && amountField.FieldType == DocumentFieldType.Currency)
            {
                taxDetail.Amount = (decimal)amountField.ValueCurrency.Amount;
                taxDetail.AmountCurrency = amountField.ValueCurrency.CurrencyCode
                                          ?? amountField.ValueCurrency.CurrencySymbol;
                taxDetail.AmountConfidence = amountField.Confidence ?? 0;
            }

            // Rate
            if (taxDict.TryGetValue("Rate", out var rateField)
                && rateField.FieldType == DocumentFieldType.Double)
            {
                taxDetail.Rate = rateField.ValueDouble;
                taxDetail.RateConfidence = rateField.Confidence ?? 0;
            }
            else if (taxDict.TryGetValue("Rate", out var rateIntField)
                && rateIntField.FieldType == DocumentFieldType.Int64)
            {
                taxDetail.Rate = rateIntField.ValueInt64;
                taxDetail.RateConfidence = rateIntField.Confidence ?? 0;
            }

            // NetAmount
            if (taxDict.TryGetValue("NetAmount", out var netAmountField)
                && netAmountField.FieldType == DocumentFieldType.Currency)
            {
                taxDetail.NetAmount = (decimal)netAmountField.ValueCurrency.Amount;
                taxDetail.NetAmountCurrency = netAmountField.ValueCurrency.CurrencyCode
                                             ?? netAmountField.ValueCurrency.CurrencySymbol;
                taxDetail.NetAmountConfidence = netAmountField.Confidence ?? 0;
            }

            // Description
            if (taxDict.TryGetValue("Description", out var descField)
                && descField.FieldType == DocumentFieldType.String)
            {
                taxDetail.Description = descField.ValueString;
                taxDetail.DescriptionConfidence = descField.Confidence ?? 0;
            }

            result.TaxDetails.Add(taxDetail);

            _logger.LogInformation("Extracted tax detail: {Description} Amount={Amount} {Currency} Rate={Rate}%",
                taxDetail.Description ?? "N/A", taxDetail.Amount, taxDetail.AmountCurrency ?? "N/A", taxDetail.Rate);
        }

        _logger.LogInformation("Extracted {ExtractedCount} tax details", result.TaxDetails.Count);
    }

    private void ExtractTax(AnalyzedDocument document, ReceiptExtractionResult result, ref bool needsReview)
    {
        if (document.Fields.TryGetValue("Tax", out var taxField)
            && taxField.FieldType == DocumentFieldType.Currency)
        {
            result.TotalTax = (decimal)taxField.ValueCurrency.Amount;
            result.TotalTaxCurrency = taxField.ValueCurrency.CurrencyCode
                                   ?? taxField.ValueCurrency.CurrencySymbol;
            result.TotalTaxConfidence = taxField.Confidence ?? 0;

            if (result.TotalTaxConfidence < ConfidenceThreshold)
            {
                _logger.LogInformation(
                    "Tax confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TotalTaxConfidence, ConfidenceThreshold);
            }
        }

        else if (document.Fields.TryGetValue("TotalTax", out var totalTaxField)
            && totalTaxField.FieldType == DocumentFieldType.Currency)
        {
            result.TotalTax = (decimal)totalTaxField.ValueCurrency.Amount;
            result.TotalTaxCurrency = totalTaxField.ValueCurrency.CurrencyCode
                                     ?? totalTaxField.ValueCurrency.CurrencySymbol;
            result.TotalTaxConfidence = totalTaxField.Confidence ?? 0;

            if (result.TotalTaxConfidence < ConfidenceThreshold)
            {
                _logger.LogInformation(
                    "TotalTax confidence {Confidence:F2} is below threshold {Threshold}",
                    result.TotalTaxConfidence, ConfidenceThreshold);
            }
        }
    }
}