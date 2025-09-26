import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'
import { BASE_URL } from '../../constants'
import { Link } from 'react-router-dom'
import { User } from '../../app/types'

type Props = {
  user: User
}

export const Profile: React.FC<Props> = ({ user }) => {
  const { name, email, avatarUrl, id } = user

  return (
    <div>
      <Card className="py-4 w-[302px]">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <Image
            alt="Card profile"
            className="object-cover rounded-xl"
            src={`${BASE_URL}${avatarUrl}`}
            width={370}
          />
        </CardHeader>

        <CardBody>
          <h4 className="font-bold text-large">{name}</h4>
          <p className="text-default-500 flex items-center gap-2 mb-3">
            {email}
          </p>
          <Link to={`/users/${id}`}>
            <h4 className="text-s text-default-700 flex items-center gap-2 
                 hover:text-default-900 transition-colors duration-200">Мой профиль</h4>
          </Link>
        </CardBody>
      </Card>
    </div>
  )
}
