import Box from './box';
import Button from './button';

export default async function UserActions() {
    const canCreateDiscussion = (Math.random() * 10) > 5;
    return (
        <Box className='flex flex-col'>
            <Button disabled={canCreateDiscussion}>发布新主题</Button>
        </Box>
    );
}
