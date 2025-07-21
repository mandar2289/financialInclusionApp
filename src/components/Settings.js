import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Form } from 'react-bootstrap';

function Settings() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <Card style={{ padding: 20 }}>
      <Form.Group>
        <Form.Label>{t('selectLanguage')}</Form.Label>
        <Form.Select onChange={changeLanguage} defaultValue={i18n.language}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </Form.Select>
      </Form.Group>
    </Card>
  );
}

export default Settings;
