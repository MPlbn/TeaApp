import { Group } from "@mantine/core";
import { IconStar, IconStarFilled, IconStarHalfFilled } from "@tabler/icons-react";

type RatingStarsProps = {
    rating: number;
}

const MAX_STARS_NUMBER = 5;

const RatingStars = (props: RatingStarsProps) => {
    const fullStars = Math.floor(props.rating / 2);
    const hasHalfStar = props.rating % 2 !== 0;
    const emptyStars = MAX_STARS_NUMBER - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <Group gap={2}>
            {Array.from({ length: fullStars }, (_, index) => (
                <IconStarFilled key={`full-${index}`} color="#C49A36" size={18} />
            ))}

            {hasHalfStar && (
                <IconStarHalfFilled color="#C49A36" size={18} />
            )}

            {Array.from({ length: emptyStars }, (_, index) => (
                <IconStar key={`full-${index}`} color="#C49A36" size={18} />
            ))}
        </Group>
    )
}

export default RatingStars;