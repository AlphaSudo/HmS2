package com.pro.ehrreportsservice.mapper;

import com.pro.ehrreportsservice.dto.EhrReportDTO;
import com.pro.ehrreportsservice.entity.EhrReport;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EhrReportMapper {

    EhrReportMapper INSTANCE = Mappers.getMapper(EhrReportMapper.class);

    EhrReportDTO toDto(EhrReport ehrReport);

    EhrReport toEntity(EhrReportDTO ehrReportDTO);

    List<EhrReportDTO> toDtoList(List<EhrReport> ehrReports);
} 