import { useState } from 'react'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import formImageUrl from './assets/form-image.webp'
import styles from './Form.module.scss'

interface FormProps {
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

export const Form = ({ onSubmit }: FormProps) => {
  const [whatsapp, setWhatsapp] = useState(false)
  const [telegram, setTelegram] = useState(false)

  return (
    <div className={styles.root}>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.container}>
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
          <textarea className={styles.textarea} placeholder="Введите ваш вопрос" />
        </div>
        <Button type="submit" className={styles.submitButton}>Отправить</Button>
        <p className={styles.consent}>
          Отправляя заявку, вы соглашаетесь на <a href="#">обработку персональных данных</a>
        </p>
      </form>
      <div className={styles.formImageWrapper}>
        <img className={styles.formImage} src={formImageUrl} alt="Form" />
      </div>
    </div>
  )
}
