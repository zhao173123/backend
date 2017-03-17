DROP TABLE public.t_host_contract;

CREATE TABLE public.t_host_contract
(
  contract_id          SERIAL     NOT NULL PRIMARY KEY,
  host_id              BIGINT     NOT NULL,
  contract_type        INTEGER    NOT NULL,
  talent_type          INTEGER [] NOT NULL,
  required_work_hours  FLOAT8     NOT NULL,
  base_salary_amount   FLOAT8     NOT NULL,
  base_salary_currency INTEGER    NOT NULL,
  platform_share_rate  FLOAT4     NOT NULL,
  host_share_rate      FLOAT4     NOT NULL,
  settlement_base      FLOAT8     NOT NULL,
  settlement_due_day   INTEGER    NOT NULL,
  director_id          BIGINT,
  supervisor_id        BIGINT,
  agent_id             BIGINT,
  bank_name            TEXT,
  bank_account         TEXT,
  start_date           TIMESTAMP(6),
  end_date             TIMESTAMP(6),
  contract_files       JSONB,
  id_card_face         JSONB,
  id_card_back         JSONB,
  id_card_hold         JSONB,
  create_time          TIMESTAMP(6) DEFAULT now(),
  update_time          TIMESTAMP(6) DEFAULT now()
)
WITH (
OIDS = FALSE
);

COMMENT ON TABLE public.t_host_contract IS '主播合约';
COMMENT ON COLUMN t_host_contract.contract_id IS '合约ID';
COMMENT ON COLUMN t_host_contract.host_id IS '主播ID';
COMMENT ON COLUMN t_host_contract.contract_type IS '签约类型';
COMMENT ON COLUMN t_host_contract.talent_type IS '主播类型:脱口秀,音乐,生活方式...';
COMMENT ON COLUMN t_host_contract.required_work_hours IS '月时长要求';
COMMENT ON COLUMN t_host_contract.base_salary_amount IS '底薪';
COMMENT ON COLUMN t_host_contract.base_salary_currency IS '计价货币';
COMMENT ON COLUMN t_host_contract.platform_share_rate IS '平台分成比例';
COMMENT ON COLUMN t_host_contract.host_share_rate IS '主播分成比例';
COMMENT ON COLUMN t_host_contract.settlement_base IS '结算基数';
COMMENT ON COLUMN t_host_contract.settlement_due_day IS '结算日期';
COMMENT ON COLUMN t_host_contract.director_id IS '管理人总监';
COMMENT ON COLUMN t_host_contract.supervisor_id IS '管理人主管';
COMMENT ON COLUMN t_host_contract.agent_id IS '管理人专员';
COMMENT ON COLUMN t_host_contract.bank_name IS '结算银行';
COMMENT ON COLUMN t_host_contract.bank_account IS '银行账号';
COMMENT ON COLUMN t_host_contract.start_date IS '合约起始日期';
COMMENT ON COLUMN t_host_contract.end_date IS '合约结束日期';
COMMENT ON COLUMN t_host_contract.contract_files IS '上传合约';
COMMENT ON COLUMN t_host_contract.id_card_face IS '身份证扫描件（正）';
COMMENT ON COLUMN t_host_contract.id_card_back IS '身份证扫描件（背）';
COMMENT ON COLUMN t_host_contract.id_card_hold IS '手持身份证照片';

ALTER TABLE public.t_host_contract
  OWNER TO postgres;

ALTER SEQUENCE public.t_host_contract_contract_id_seq
OWNER TO postgres;

ALTER SEQUENCE public.t_host_contract_contract_id_seq
RESTART WITH 8000000
INCREMENT 1;


INSERT INTO public.t_host_contract
(
  host_id,
  contract_type,
  talent_type,
  required_work_hours,
  base_salary_amount,
  base_salary_currency,
  platform_share_rate,
  host_share_rate,
  settlement_base,
  settlement_due_day,
  director_id,
  supervisor_id,
  agent_id,
  bank_name,
  bank_account,
  start_date,
  end_date,
  contract_files,
  id_card_face,
  id_card_back,
  id_card_hold
)
VALUES
  (
    7000001,
    1,
    '{1,2}',
    30.3,
    88888.8,
    8,
    33.3,
    66.6,
    666.66,
    31,
    8000001,
    8000001,
    8000001,
    '中国工商银行陆家嘴分行',
    'abc55667890435432645',
    now(),
    (now() + '3 year ' :: INTERVAL),
    '[
      {
        "fileName": "无底薪合同_正式版_20160825.pdf",
        "fileAddress": "7000/001/rBAOcVeycx6.pdf"
      },
      {
        "fileName": "无底薪合同_8月版_20160727.pdf",
        "fileAddress": "7000/001/rBAOcVedfcx1.pdf"
      }
    ]',
    '{
      "fileName": "id.jpg",
      "fileAddress": "7000/001/rBAOcVeycx6.jpg"
    }',
    '{
      "fileName": "id.jpg",
      "fileAddress": "7000/001/rBAOcVeycx6.jpg"
    }',
    '{
      "fileName": "id.jpg",
      "fileAddress": "7000/001/rBAOcVeycx6.jpg"
    }'
  );

