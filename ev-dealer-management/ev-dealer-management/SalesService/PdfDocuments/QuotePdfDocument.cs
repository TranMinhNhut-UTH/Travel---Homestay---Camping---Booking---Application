using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using SalesService.DTOs;
using System.Collections.Generic;

namespace SalesService.PdfDocuments
{
    public class QuotePdfDocument : IDocument
    {
        public GenerateQuotePdfRequestDto Model { get; }

        public QuotePdfDocument(GenerateQuotePdfRequestDto model)
        {
            Model = model;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;

        public void Compose(IDocumentContainer container)
        {
            container
                .Page(page =>
                {
                    page.Margin(50);
                    page.Header().Text("Báo Giá Xe").SemiBold().FontSize(20);

                    page.Content().Column(column =>
                    {
                        // Customer and Vehicle details can be added here
                        // For example:
                        if (Model.CustomerInfo != null)
                        {
                            column.Item().Text(text =>
                            {
                                text.Span("Khách hàng: ").SemiBold();
                                text.Span(Model.CustomerInfo.GetValueOrDefault("Name", ""));
                            });
                        }

                        column.Item().PaddingTop(20).Text("Chi tiết sản phẩm:").SemiBold();

                        // Table for items
                        column.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.ConstantColumn(50);
                                columns.ConstantColumn(100);
                                columns.ConstantColumn(100);
                            });

                            table.Header(header =>
                            {
                                header.Cell().Text("Sản phẩm");
                                header.Cell().Text("SL");
                                header.Cell().AlignRight().Text("Đơn giá");
                                header.Cell().AlignRight().Text("Thành tiền");
                            });

                            foreach (var item in Model.QuoteItems)
                            {
                                table.Cell().Text(item.GetValueOrDefault("VehicleName", ""));
                                table.Cell().Text(item.GetValueOrDefault("Quantity", ""));
                                table.Cell().AlignRight().Text(item.GetValueOrDefault("UnitPrice", ""));
                                table.Cell().AlignRight().Text(item.GetValueOrDefault("ItemTotal", ""));
                            }
                        });

                        column.Item().AlignRight().PaddingTop(10).Text($"Tổng cộng: {Model.TotalCalculatedAmount}").SemiBold();
                    });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("Trang ");
                        text.CurrentPageNumber();
                    });
                });
        }
    }
}
