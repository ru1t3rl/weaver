import {
  axiosGetRequestConfig,
  axiosPostRequestConfig,
  OptionType,
  ServiceTemplateDetailModel,
  ServiceTemplateOptionModel,
  ServiceType2 as ServiceType,
  useGetServiceTemplateUuid,
  usePutServiceTemplate,
} from '@weaver/shared';
import { AutoComplete, Button, Col, Divider, Flex, Input, Modal, Row, Spin, Typography } from 'antd';
import { useState } from 'react';
import { LuPlus, LuSave, LuSquareX } from 'react-icons/lu';
import { useNotification } from '../../../hooks';
import { ServiceTemplateOption as ServiceTemplateOptionComponent } from '../../service-template-option/service-template-option';
import styles from './create-template-modal.module.scss';

interface CreateTemplateModalProps {
  open?: boolean;
  templateUuid?: string;
  onOk?: () => void;
  onCancel?: () => void;
}

export function CreateTemplateModal(props: CreateTemplateModalProps) {
  const { showNotification } = useNotification();
  const { open, templateUuid = '', onOk, onCancel } = props;
  const { isLoading } = useGetServiceTemplateUuid(templateUuid, { axios: axiosGetRequestConfig });

  const { mutate: saveService, isLoading: isSaving } = usePutServiceTemplate({
    mutation: {
      onSuccess: () => {
        showNotification('Template saved successfully', '', 'success');
      },
      onError: error => {
        showNotification('Failed to save the template', error.message, 'error');
      },
    },
    axios: axiosPostRequestConfig,
  });

  const [template, setTemplate] = useState<ServiceTemplateDetailModel>({
    name: '',
    type: ServiceType.Custom,
    config: [],
  } as ServiceTemplateDetailModel);

  const [tempType, setTempType] = useState<ServiceType>(template.type);

  function handleNameChange(value: string) {
    setTemplate(prev => ({
      ...prev,
      name: value,
    }));
  }

  function handleTypeAutoCompleteChange(value: ServiceType) {
    setTemplate(prev => ({
      ...prev,
      type: value,
    }));

    setTempType(value);
  }

  function handleConfigInputChange(value: ServiceTemplateOptionModel, index: number) {
    const updatedArray = template.config ? [...template.config] : [];
    updatedArray[index] = value;

    setTemplate(prev => ({
      ...prev,
      config: updatedArray,
    }));
  }

  function handleAddOptionClicked() {
    setTemplate(prev => ({
      ...prev,
      config: [
        ...(prev.config ?? []),
        {
          id: null,
          name: '',
          type: OptionType.String,
        },
      ],
    }));
  }

  function handleRemoveOptionClicked(index: number) {
    setTemplate(prev => ({
      ...prev,
      config: prev.config?.filter((_, i) => i !== index) ?? [],
    }));
  }

  function handleSaveClicked() {
    saveService({
      data: template.config ?? [],
      params: {
        name: template.name,
        type: Object.values(ServiceType).indexOf(template.type),
      },
    });
  }

  return (
    <Modal
      open={open}
      centered
      footer={() => (
        <>
          <Button icon={<LuSave />} onClick={handleSaveClicked}>
            Save
          </Button>
        </>
      )}
      width={{
        xs: '90%',
        sm: '80%',
        md: '70%',
        lg: '60%',
        xl: '50%',
        xxl: '40%',
      }}
      onOk={onOk}
      onCancel={onCancel}
    >
      {(isLoading || isSaving) && (
        <div className={styles['loading-overlay']}>
          <Spin />
        </div>
      )}
      {!isLoading && (
        <Flex vertical gap={5}>
          <Typography.Title level={4}>General</Typography.Title>
          <Input
            placeholder='Template name'
            value={template.name}
            variant={'filled'}
            onChange={event => handleNameChange(event.target.value)}
          />
          <Row>
            <Col span={6}>
              <Typography.Paragraph className={styles['label']}>Type</Typography.Paragraph>
            </Col>
            <Col span={18}>
              <AutoComplete
                className={styles['type-autocomplete']}
                value={tempType}
                options={Object.keys(ServiceType).map(key => ({
                  label: key,
                  value: key,
                }))}
                onChange={setTempType}
                onSelect={handleTypeAutoCompleteChange}
                onBlur={() => setTempType(template.type)}
              />
            </Col>
          </Row>
          <Typography.Title level={4}>Config</Typography.Title>
          {template.config?.map((value, index) => (
            <Flex vertical key={index}>
              <Flex align='center' gap={10}>
                <Button
                  color='danger'
                  variant='text'
                  icon={<LuSquareX size={'1.25em'} />}
                  onClick={() => handleRemoveOptionClicked(index)}
                  style={{
                    flexShrink: 1,
                  }}
                />
                <ServiceTemplateOptionComponent
                  value={value}
                  onChange={value => handleConfigInputChange(value, index)}
                />
              </Flex>
              {index !== (template.config?.length ?? 1) - 1 && <Divider />}
            </Flex>
          ))}
          <Button onClick={handleAddOptionClicked} icon={<LuPlus />}>
            Add Option
          </Button>
        </Flex>
      )}
    </Modal>
  );
}
