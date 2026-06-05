package org.dromara.assessment.domain.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.dromara.common.mybatis.core.domain.BaseEntity;

import java.util.Date;

/**
 * 测评记录 实体类
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("assess_record")
public class AssessRecord extends BaseEntity {

    @TableId(value = "record_id", type = IdType.AUTO)
    private Long recordId;

    /** 所属计划ID */
    private Long planId;

    /** 量表ID */
    private Long scaleId;

    /** 受测者ID */
    private Long userId;

    /** 作答次数 */
    private Integer attemptNo;

    /** 状态（0进行中 1已完成 2已暂停 3已超时 4异常） */
    private String status;

    /** 开始时间 */
    private Date startTime;

    /** 结束时间 */
    private Date endTime;

    /** 实际用时(秒) */
    private Integer durationSeconds;

    /** 答题进度 */
    private Integer progress;

    /** 总题数 */
    private Integer totalQuestions;

    /** IP地址 */
    private String ipAddress;

    /** 设备信息 */
    private String deviceInfo;

    /** 异常标记（0正常 1乱答 2白卷 3速答） */
    private String abnormalFlag;

    /** 是否同意知情同意书 */
    private Boolean consentAgreed;

    /** 同意时间 */
    private Date consentTime;
}
