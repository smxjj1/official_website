import { fail, success } from '~~/server/utils/response';

export default defineEventHandler((event) => {
  const { id } = getQuery<{
    id: string;
  }>(event);

  if (id) {
    return success({ id });
  }
  else {
    return fail('id is required');
  }
});
