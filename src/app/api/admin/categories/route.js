import _ from 'lodash';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth';
import { ModelError, categoryModel } from '@/lib/models';
import rest from '@/lib/rest';
import logger from '@/lib/logger';

export async function POST(request, { params }) {
    // require admin
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) return rest.notFound();

    let { name, slug, sequence, description, color } = await request.json();
    sequence = Number(sequence) || 0;
    name = _.trim(name);
    slug = _.trim(slug);
    color = _.trim(color);

    const validateResult = categoryModel.validate({ name, slug, sequence, description, color });
    if (validateResult.error) return rest.badRequest({ message: validateResult.message });

    try {
        const newCategory = await categoryModel.create({ name, slug, sequence, description, color });
        return rest.created({ data: newCategory.id });
    } catch (err) {
        if (err instanceof ModelError)
            return rest.badRequest({ message: err.message });
        else {
            logger.warn(err);
            return rest.badRequest();
        }
    }
}