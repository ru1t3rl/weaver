import { OptionType, ServiceOption } from '@weaver/shared';
import { Flex, Input, Switch, Typography } from 'antd';
import { ReactNode } from 'react';
import styles from './service-option.module.scss';

interface ServiceOptionProps {
  value: ServiceOption;
}

export function ServiceOption(props: ServiceOptionProps) {
  const { value } = props;

  function getInputFromType(type: OptionType): ReactNode {
    switch (type) {
      case OptionType.Boolean:
        return <Switch />;
      case OptionType.String:
        return <Input />;
    }
  }

  return (
    <Flex align='center'>
      <Typography.Text className={styles['label']}>{value.name}</Typography.Text>
      {getInputFromType(value.type)}
    </Flex>
  );
}

export default ServiceOption;
