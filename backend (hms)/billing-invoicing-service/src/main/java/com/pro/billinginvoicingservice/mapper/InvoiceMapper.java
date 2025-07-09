package com.pro.billinginvoicingservice.mapper;

import com.pro.billinginvoicingservice.dto.InvoiceDTO;
import com.pro.billinginvoicingservice.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    InvoiceMapper INSTANCE = Mappers.getMapper(InvoiceMapper.class);

    InvoiceDTO toDto(Invoice invoice);

    Invoice toEntity(InvoiceDTO invoiceDTO);

    List<InvoiceDTO> toDtoList(List<Invoice> invoices);
} 