import { OptionType, ServiceTemplateOptionModel } from '@weaver/shared';
import { Col, Flex, Input, Row, Select, Typography } from 'antd';
import styles from './service-template-option.module.scss';

interface ServiceTemplateOptionProps {
  value: ServiceTemplateOptionModel;
  onChange?: (value: ServiceTemplateOptionModel) => void;
}

export function ServiceTemplateOption(props: ServiceTemplateOptionProps) {
  const { value, onChange } = props;

  function handleChange(key: keyof ServiceTemplateOptionModel, inputValue: unknown) {
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

export default ServiceTemplateOption;
