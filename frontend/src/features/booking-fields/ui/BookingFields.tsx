import { Button } from '@/shared/ui/components/Button/Button';
import { Checkbox } from '@/shared/ui/components/Checkbox/Checkbox';
import { useState } from 'react';
import formImage from '../assets/form-image.webp';
import styles from './BookingFields.module.scss';

export const BookingFields = () => {
  const [whatsapp, setWhatsapp] = useState(false);
  const [telegram, setTelegram] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.fieldsContainer}>
        <input className={styles.input} type="text" placeholder="Имя" />
        <input className={styles.input} type="tel" placeholder="Телефон" />
        <div className={styles.checkboxes}>
          <span className={styles.checkboxesTitle}>Куда написать?*</span>
          <div className={styles.checkboxesItems}>
            <Checkbox
              name="whatsapp"
              label="Whatsapp"
              checked={whatsapp}
              onChange={setWhatsapp}
            />
            <Checkbox
              name="telegram"
              label="Telegram"
              checked={telegram}
              onChange={setTelegram}
            />
          </div>
        </div>
        <textarea
          className={styles.textarea}
          placeholder="Введите ваш вопрос"
        />
      </div>
      <div>
        <Button type="submit" className={styles.submitButton}>
          Отправить
        </Button>
        <p className={styles.consent}>
          Отправляя заявку, вы соглашаетесь на{' '}
          <a href="#">обработку персональных данных</a>
        </p>
      </div>
      <div className={styles.formImageWrapper}>
        <img className={styles.formImage} src={formImage} alt="Form" />
      </div>
    </div>
  );
};
