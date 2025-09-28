import { Card, CardBody, CardHeader, Image } from '@nextui-org/react'
import { BASE_URL } from '../../constants'
import { User } from '../../app/types'

type Props = {
  user: User
}

export const Profile: React.FC<Props> = ({ user }) => {
  const { name, email, avatarUrl } = user

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
        </CardBody>
      </Card>
    </div>
  )
}
