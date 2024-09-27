// Определяем интерфейс для пользователя
export type UserType = {
  id: string
  name: string
}

// Определяем интерфейс для сообщения
export type MessageType = {
  message: string
  id: string
  user: UserType
}
