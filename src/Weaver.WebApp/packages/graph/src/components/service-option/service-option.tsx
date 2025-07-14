import { OptionType, ServiceOption as ServiceOptionModel } from '@weaver/shared';
import { Col, Flex, Input, Row, Select, Typography } from 'antd';
import styles from './service-option.module.scss';

interface ServiceOptionProps {
  value: ServiceOptionModel;
  onChange?: (value: ServiceOptionModel) => void;
}

export function ServiceOption(props: ServiceOptionProps) {
  const { value, onChange } = props;

  function handleChange(key: keyof ServiceOptionModel, inputValue: unknown) {
    const updatedValue = {
      ...value,
      [key]: inputValue,
    };

    if (onChange) {
      onChange(updatedValue);
    }
  }

  return (
    <Flex vertical className={styles['container']}>
      <Row align={'middle'}>
        <Col span={6}>
          <Typography.Paragraph className={styles['label']}>Name</Typography.Paragraph>
        </Col>
        <Col span={18}>
          <Input value={value.name} onChange={event => handleChange('name', event.target.value)} />
        </Col>
      </Row>
      <Row align={'middle'}>
        <Col span={6}>
          <Typography.Paragraph className={styles['label']}>Type</Typography.Paragraph>
        </Col>
        <Col span={18}>
          <Select
            className={styles['type-select']}
            options={Object.values(OptionType).map(value => ({
              value: value as OptionType,
              label: value,
            }))}
            value={value.type}
            onChange={value => handleChange('type', value)}
          />
        </Col>
      </Row>
    </Flex>
  );
}

export default ServiceOption;
